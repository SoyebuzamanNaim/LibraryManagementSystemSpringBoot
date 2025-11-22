package bd.edu.seu.librarymanagementsystem.validator;

import bd.edu.seu.librarymanagementsystem.model.Allotment;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;

import java.time.temporal.ChronoUnit;

public class AllotmentValidator {

    private static final int MAX_LOAN_DAYS = 14;

    private AllotmentValidator() {
    }

    public static void validate(Allotment allotment) {
        if (allotment == null) {
            throw new IllegalArgumentException("Allotment cannot be null");
        }

        if (StringUtils.isBlank(allotment.getBookId())) {
            throw new IllegalArgumentException("Book ID is required");
        }

        if (StringUtils.isBlank(allotment.getStudentId())) {
            throw new IllegalArgumentException("Student ID is required");
        }

        if (allotment.getDueAt() == null) {
            throw new IllegalArgumentException("Due date is required");
        }

        if (allotment.getAllottedAt() == null) {
            allotment.setAllottedAtIfNull();
        }

        // Validate that due date is not more than 14 days from allotted date
        if (allotment.getAllottedAt() != null && allotment.getDueAt() != null) {
            long daysBetween = ChronoUnit.DAYS.between(allotment.getAllottedAt(), allotment.getDueAt());
            if (daysBetween > MAX_LOAN_DAYS) {
                throw new IllegalArgumentException("Books can be allotted for a maximum of " + MAX_LOAN_DAYS + " days");
            }
            if (daysBetween < 0) {
                throw new IllegalArgumentException("Due date cannot be before allotted date");
            }
        }

        allotment.setStatusIfNull();
    }

    public static void validateId(String id) {
        if (StringUtils.isBlank(id)) {
            throw new IllegalArgumentException("Allotment ID is required");
        }
    }
}
