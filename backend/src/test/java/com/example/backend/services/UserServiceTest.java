package com.example.backend.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.backend.dto.DoctorCreateRequest;
import com.example.backend.dto.DoctorUpdateRequest;
import com.example.backend.dto.PatientCreateRequest;
import com.example.backend.dto.PatientUpdateRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.dto.UserUpdateRequest;
import com.example.backend.models.Doctor;
import com.example.backend.models.Gender;
import com.example.backend.models.Patient;
import com.example.backend.models.Role;
import com.example.backend.models.User;
import com.example.backend.repositories.DoctorRepo;
import com.example.backend.repositories.PatientRepo;
import com.example.backend.repositories.UserRepo;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepo userRepo;
    @Mock
    private PatientRepo patientRepo;
    @Mock
    private DoctorRepo doctorRepo;
    @Mock
    private PasswordEncoder encoder;

    @InjectMocks
    private UserService service;

    @BeforeEach
    void setUpEncoder() {
        lenient().when(encoder.encode(any())).thenAnswer(inv -> "enc-" + inv.getArgument(0));
    }

    @Test
    void listAdmins_mapsResponses() {
        User admin = baseUser(Role.ADMIN);
        when(userRepo.findAllAdmins()).thenReturn(List.of(admin));

        List<UserResponse> responses = service.listAdmins();

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).role()).isEqualTo(Role.ADMIN);
        assertThat(responses.get(0).userType()).isEqualTo("USER");
    }

    @Test
    void promoteToAdmin_updatesRole() {
        UUID id = UUID.randomUUID();
        User user = baseUser(Role.PATIENT);
        user.setId(id);
        when(userRepo.findById(id)).thenReturn(Optional.of(user));
        when(userRepo.save(user)).thenReturn(user);

        UserResponse response = service.promoteToAdmin(id);

        assertThat(response.role()).isEqualTo(Role.ADMIN);
        verify(userRepo).save(user);
    }

    @Test
    void createPatient_encodesPasswordAndSetsRole() {
        PatientCreateRequest request = new PatientCreateRequest(
                "Jane Doe",
                "JANE@MAIL.COM",
                "secret",
                "123",
                "Street",
                Gender.FEMALE);
        when(userRepo.findByEmail("jane@mail.com")).thenReturn(Optional.empty());
        when(patientRepo.save(any(Patient.class))).thenAnswer(inv -> {
            Patient p = inv.getArgument(0);
            p.setId(UUID.randomUUID());
            return p;
        });

        UserResponse response = service.createPatient(request);

        assertThat(response.role()).isEqualTo(Role.PATIENT);
        verify(patientRepo).save(any(Patient.class));
    }

    @Test
    void createPatient_rejectsDuplicateEmails() {
        when(userRepo.findByEmail("exists@mail.com")).thenReturn(Optional.of(new User()));
        PatientCreateRequest request = new PatientCreateRequest(
                "Test",
                "exists@mail.com",
                "pw",
                null,
                null,
                Gender.OTHER);
        assertThatThrownBy(() -> service.createPatient(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email already exists");
    }

    @Test
    void createDoctor_setsSpecialFieldsAndEncodesPassword() {
        DoctorCreateRequest request = new DoctorCreateRequest(
                "Doc",
                "DOC@MAIL.COM",
                "pass123",
                "111",
                "Street",
                Gender.MALE,
                "Occupational",
                "Bio",
                new BigDecimal("4.9"),
                new BigDecimal("85"),
                LocalDateTime.of(2025, 1, 1, 9, 0),
                LocalDateTime.of(2025, 1, 1, 17, 0),
                "pic.jpg");
        when(userRepo.findByEmail("doc@mail.com")).thenReturn(Optional.empty());
        when(doctorRepo.save(any(Doctor.class))).thenAnswer(inv -> {
            Doctor d = inv.getArgument(0);
            d.setId(UUID.randomUUID());
            return d;
        });

        UserResponse response = service.createDoctor(request);

        assertThat(response.userType()).isEqualTo("DOCTOR");
        verify(doctorRepo).save(any(Doctor.class));
    }

    @Test
    void listAndRetrieveUsers_coverAllPaths() {
        Doctor doctor = doctor();
        Patient patient = patient();
        when(userRepo.findAll()).thenReturn(List.of(doctor, patient));
        when(userRepo.findAllPatients()).thenReturn(List.of(patient));
        when(userRepo.findAllDoctors()).thenReturn(List.of(doctor));
        when(userRepo.findById(patient.getId())).thenReturn(Optional.of(patient));

        List<UserResponse> all = service.listAllUsers();
        assertThat(all).hasSize(2);
        assertThat(service.listPatients()).hasSize(1);
        assertThat(service.listDoctors()).hasSize(1);
        assertThat(service.getById(patient.getId()).userType()).isEqualTo("PATIENT");

        when(userRepo.findById(patient.getId())).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.getById(patient.getId()))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void updateCommon_updatesFieldsAndReEncodesPassword() {
        User user = baseUser(Role.PATIENT);
        user.setId(UUID.randomUUID());
        when(userRepo.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepo.save(user)).thenReturn(user);

        UserUpdateRequest request = new UserUpdateRequest(
                "New Name",
                "999",
                "New Address",
                Gender.FEMALE,
                "newpass");

        UserResponse response = service.updateCommon(user.getId(), request);

        assertThat(response.name()).isEqualTo("New Name");
        assertThat(user.getPassword()).isEqualTo("enc-newpass");
    }

    @Test
    void updateDoctor_appliesSpecializedFields() {
        Doctor doctor = doctor();
        when(doctorRepo.findById(doctor.getId())).thenReturn(Optional.of(doctor));
        when(userRepo.save(doctor)).thenReturn(doctor);

        DoctorUpdateRequest request = new DoctorUpdateRequest(
                "Updated",
                "UPDATED@mail.com",
                "321",
                "Clinic",
                Gender.MALE,
                "pass",
                "PT",
                "New bio",
                new BigDecimal("5.0"),
                new BigDecimal("100"),
                LocalDateTime.of(2025, 5, 1, 9, 0),
                LocalDateTime.of(2025, 5, 1, 18, 0),
                "new.jpg");

        UserResponse response = service.updateDoctor(doctor.getId(), request);

        assertThat(response.name()).isEqualTo("Updated");
        assertThat(doctor.getSpecialty()).isEqualTo("PT");
        assertThat(doctor.getConsultationFee()).isEqualByComparingTo("100");
        verify(userRepo).save(doctor);
    }

    @Test
    void updatePatient_updatesOnlyPatients() {
        Patient patient = patient();
        when(userRepo.findById(patient.getId())).thenReturn(Optional.of(patient));
        when(userRepo.save(patient)).thenReturn(patient);

        PatientUpdateRequest request = new PatientUpdateRequest(
                "Updated Patient",
                "patient@mail.com",
                "111",
                "Road",
                Gender.MALE);

        UserResponse response = service.updatePatient(patient.getId(), request);
        assertThat(response.name()).isEqualTo("Updated Patient");

        when(userRepo.findById(patient.getId())).thenReturn(Optional.of(baseUser(Role.ADMIN)));
        assertThatThrownBy(() -> service.updatePatient(patient.getId(), request))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void delete_checksExistence() {
        UUID id = UUID.randomUUID();
        when(userRepo.existsById(id)).thenReturn(true);
        service.delete(id);
        verify(userRepo).deleteById(id);

        when(userRepo.existsById(id)).thenReturn(false);
        assertThatThrownBy(() -> service.delete(id))
                .isInstanceOf(NoSuchElementException.class);
    }

    private User baseUser(Role role) {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("user@paxify.com");
        user.setPassword("pw");
        user.setName("User");
        user.setRole(role);
        user.setGender(Gender.OTHER);
        return user;
    }

    private Doctor doctor() {
        Doctor doctor = new Doctor();
        doctor.setId(UUID.randomUUID());
        doctor.setEmail("doc@paxify.com");
        doctor.setPassword("pw");
        doctor.setName("Doctor");
        doctor.setRole(Role.DOCTOR);
        doctor.setGender(Gender.MALE);
        doctor.setSpecialty("OT");
        doctor.setBio("Bio");
        doctor.setRate(new BigDecimal("4.5"));
        doctor.setConsultationFee(new BigDecimal("80"));
        doctor.setAvailableFrom(LocalDateTime.of(2025, 1, 1, 9, 0));
        doctor.setAvailableTo(LocalDateTime.of(2025, 1, 1, 17, 0));
        return doctor;
    }

    private Patient patient() {
        Patient patient = new Patient();
        patient.setId(UUID.randomUUID());
        patient.setEmail("patient@paxify.com");
        patient.setPassword("pw");
        patient.setName("Patient");
        patient.setRole(Role.PATIENT);
        patient.setGender(Gender.FEMALE);
        return patient;
    }
}
