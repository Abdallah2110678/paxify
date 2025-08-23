const PatientDoctorComments = () => {
  const comments = [
    { id: 1, date: "2025-07-10", doctor: "Dr. Adams", comment: "Keep monitoring blood sugar daily." },
    { id: 2, date: "2025-06-05", doctor: "Dr. Brown", comment: "Increase water intake and exercise regularly." },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Doctor's Comments</h2>
      <ul className="space-y-2">
        {comments.map((c) => (
          <li
            key={c.id}
            className="p-4 bg-white shadow rounded-lg border"
          >
            <p><strong>{c.date}</strong> - {c.doctor}</p>
            <p className="text-sm text-gray-600">{c.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientDoctorComments;
