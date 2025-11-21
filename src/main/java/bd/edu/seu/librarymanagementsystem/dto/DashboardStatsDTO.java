package bd.edu.seu.librarymanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalBooks;
    private Long totalStudents;
    private Long activeAllotments;
    private Long overdueAllotments;

    // Need to add this in the html
    private Long totalVendors;
    private Long totalPublications;
    private Long activeSubscriptions;
    // Recent Activity here
}
