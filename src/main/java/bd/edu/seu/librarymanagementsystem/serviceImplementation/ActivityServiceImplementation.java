package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.model.Activity;
import bd.edu.seu.librarymanagementsystem.service.ActivityService;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class ActivityServiceImplementation implements ActivityService {

    private final CopyOnWriteArrayList<Activity> activityStore = new CopyOnWriteArrayList<>();
    private static final int MAX_ACTIVITIES = 1000;

    @Override
    public void logActivity(String action, String details, String actor) {
        if (StringUtils.isBlank(action)) {
            return;
        }

        Activity activity = new Activity();
        activity.setId(UUID.randomUUID().toString());
        activity.setAction(action);
        activity.setDetails(details != null ? details : "");
        activity.setActor(actor != null ? actor : "System");
        activity.setTimestamp(LocalDateTime.now());

        activityStore.add(0, activity);

        // System.out.println("Activity logged: " + action + " by " + actor + " - " +
        // details);
        // System.out.println("Total activities: " + activityStore.size());

        if (activityStore.size() > MAX_ACTIVITIES) {
            activityStore.remove(activityStore.size() - 1);
        }
    }

    @Override
    public List<Activity> getRecentActivities(int limit) {
        List<Activity> activities = activityStore.stream()
                .limit(limit)
                .collect(Collectors.toList());
        // System.out.println("Getting recent activities: " + activities.size() + " out
        // of " + activityStore.size());
        return activities;
    }

    @Override
    public List<Activity> getAllActivities() {
        return List.copyOf(activityStore);
    }
}
