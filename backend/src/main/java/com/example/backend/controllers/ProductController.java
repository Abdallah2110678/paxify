package com.example.backend.controllers;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.models.Product;
import com.example.backend.services.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // allow frontend requests
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAll() {
        return productService.getAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.create(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        return productService.update(id, product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    @PostMapping("/upload")
    public Product createWithImage(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam Double price,
            @RequestParam Integer stock,
            @RequestParam String description,
            @RequestParam("image") MultipartFile image) throws IOException {
        // Save file
        File folder = new File("uploads");
        if (!folder.exists())
            folder.mkdirs();

        String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
        File dest = new File(folder, filename);
        image.transferTo(dest);

        // Build product
        Product product = Product.builder()
                .name(name)
                .category(category)
                .price(BigDecimal.valueOf(price))
                .stock(stock)
                .description(description)
                .imageUrl("/uploads/" + filename) // accessible URL
                .build();

        return productService.create(product);
    }

    @PostMapping("/{id}/image")
    @PreAuthorize("hasAuthority('ADMIN')") // or whichever roles you allow
    public ResponseEntity<Product> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        // make sure product exists
        Product product = productService.getById(id);

        // folder path
        Path uploadPath = Paths.get("uploads/products");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // save file
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path destination = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        // update imageUrl field
        String fileUrl = "/uploads/products/" + filename;
        product.setImageUrl(fileUrl);

        // save updated product
        Product updated = productService.update(id, product);

        return ResponseEntity.ok(updated);
    }

}
