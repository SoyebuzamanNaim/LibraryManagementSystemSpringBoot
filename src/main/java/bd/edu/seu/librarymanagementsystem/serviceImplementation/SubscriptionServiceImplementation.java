package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.model.Subscription;
import bd.edu.seu.librarymanagementsystem.service.SubscriptionService;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;
import bd.edu.seu.librarymanagementsystem.validator.SubscriptionValidator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class SubscriptionServiceImplementation implements SubscriptionService {

    private final CopyOnWriteArrayList<Subscription> subscriptionStore = new CopyOnWriteArrayList<>();

    @Override
    public Subscription saveSubscription(Subscription subscription) {
        SubscriptionValidator.validate(subscription);

        if (StringUtils.isBlank(subscription.getId())) {
            subscription.setId(UUID.randomUUID().toString());
        }

        if (subscription.getActive() == null) {
            subscription.setActive(true);
        }

        subscriptionStore.add(subscription);
        return subscription;
    }

    @Override
    public Subscription updateSubscription(String id, Subscription subscription) {
        SubscriptionValidator.validateId(id);
        SubscriptionValidator.validate(subscription);

        Subscription existing = getSubscriptionById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Subscription not found with ID: " + id);
        }

        existing.setStudentId(subscription.getStudentId());
        existing.setType(subscription.getType());
        existing.setStartDate(subscription.getStartDate());
        existing.setEndDate(subscription.getEndDate());
        existing.setActive(subscription.getActive());

        return existing;
    }

    @Override
    public void deleteSubscription(String id) {
        SubscriptionValidator.validateId(id);
        boolean removed = subscriptionStore.removeIf(subscription -> id.equals(subscription.getId()));
        if (!removed) {
            throw new IllegalArgumentException("Subscription not found with ID: " + id);
        }
    }

    @Override
    public List<Subscription> getAllSubscriptions() {
        return List.copyOf(subscriptionStore);
    }

    @Override
    public Subscription getSubscriptionById(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        return subscriptionStore.stream()
                .filter(subscription -> id.equals(subscription.getId()))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Subscription> searchSubscriptions(String searchTerm) {
        if (StringUtils.isBlank(searchTerm)) {
            return getAllSubscriptions();
        }
        String lowerSearchTerm = searchTerm.toLowerCase().trim();
        return subscriptionStore.stream()
                .filter(subscription -> {
                    String type = subscription.getType() != null ? subscription.getType().toLowerCase() : "";
                    return type.contains(lowerSearchTerm);
                })
                .collect(Collectors.toList());
    }
}
