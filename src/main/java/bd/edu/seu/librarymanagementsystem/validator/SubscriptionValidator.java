package bd.edu.seu.librarymanagementsystem.validator;

import bd.edu.seu.librarymanagementsystem.model.Subscription;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;

public class SubscriptionValidator {

    public static void validate(Subscription subscription) {
        if (subscription == null) {
            throw new IllegalArgumentException("Subscription cannot be null");
        }

        if (StringUtils.isBlank(subscription.getStudentId())) {
            throw new IllegalArgumentException("Student ID is required");
        }

        if (StringUtils.isBlank(subscription.getType())) {
            throw new IllegalArgumentException("Subscription type is required");
        }

        if (subscription.getStartDate() == null) {
            throw new IllegalArgumentException("Start date is required");
        }

        if (subscription.getEndDate() == null) {
            throw new IllegalArgumentException("End date is required");
        }

        if (subscription.getStartDate().isAfter(subscription.getEndDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        if (subscription.getActive() == null) {
            subscription.setActive(true);
        }
    }

    public static void validateId(String id) {
        if (StringUtils.isBlank(id)) {
            throw new IllegalArgumentException("Subscription ID is required");
        }
    }
}
