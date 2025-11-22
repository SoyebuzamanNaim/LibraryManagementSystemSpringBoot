package bd.edu.seu.librarymanagementsystem.util;

public class StringUtils {

    private StringUtils() {

    }

    public static boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    public static boolean isBlank(String value) {
        return !hasText(value);
    }

    public static String trim(String value) {
        return value == null ? null : value.trim();
    }
}
