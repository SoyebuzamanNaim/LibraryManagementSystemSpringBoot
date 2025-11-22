package bd.edu.seu.librarymanagementsystem.service;

import bd.edu.seu.librarymanagementsystem.model.Subscription;

import java.util.List;

public interface SubscriptionService {
    Subscription saveSubscription(Subscription subscription);

    Subscription updateSubscription(String id, Subscription subscription);

    void deleteSubscription(String id);

    List<Subscription> getAllSubscriptions();

    Subscription getSubscriptionById(String id);

    List<Subscription> searchSubscriptions(String searchTerm);
}
