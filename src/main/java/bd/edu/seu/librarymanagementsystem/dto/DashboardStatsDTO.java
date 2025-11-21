package bd.edu.seu.librarymanagementsystem.dto;

public record DashboardStatsDTO(
        Long totalBooks,
        Long totalStudents,
        Long activeAllotments,
        Long overdueAllotments,
        Long totalVendors,
        Long totalPublications,
        Long activeSubscriptions) {
}
