package bd.edu.seu.librarymanagementsystem.util;

import jakarta.servlet.http.HttpSession;

public class SessionManager {

    private SessionManager() {

    }

    public static boolean isLoggedIn(HttpSession session) {
        return session != null && session.getAttribute("email") != null;
    }

    public static void setEmail(HttpSession session, String email) {
        if (session != null) {
            session.setAttribute("email", email);
        }
    }

    public static String getEmail(HttpSession session) {
        if (session != null) {
            return (String) session.getAttribute("email");
        }
        return null;
    }

    public static void invalidate(HttpSession session) {
        if (session != null) {
            session.invalidate();
        }
    }
}
