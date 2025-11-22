package bd.edu.seu.librarymanagementsystem.service;

import bd.edu.seu.librarymanagementsystem.model.Activity;

import java.util.List;

public interface ActivityService {
    void logActivity(String action, String details, String actor);
    
    List<Activity> getRecentActivities(int limit);
    
    List<Activity> getAllActivities();
}

