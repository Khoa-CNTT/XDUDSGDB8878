package org.example.advancedrealestate_be.constant;

public class SystemConstant {
    /*Spring security 4: ROLE_ADMIN, Spring security 3 not required*/
    public static final String ONE_EQUAL_ONE = " WHERE 1 = 1 ";
    public static final String ADMIN_ROLE = "ROLE_ADMIN";
    /*Spring security 4: ROLE_ADMIN, Spring security 3 not required*/

    public static final String STAFF_ROLE = "ROLL_STAFF";
    public static final String USER_ROLE = "ROLE_USER";
    public static final String MANAGER_ROLE = "ROLE_MANAGER";
    public static final String HOME = "/trang-chu";
    public static final String ADMIN_HOME = "/admin/home";
    public static final String MODEL = "model";//này nó là constant để định nghĩa thoi
    public static final String INSERT_SUCCESS = "insert_success";
    public static final String UPDATE_SUCCESS = "update_success";
    public static final String DELETE_SUCCESS = "delete_success";
    public static final String ERROR_SYSTEM = "error_system";
    public static final String ALERT = "alert";
    public static final String MESSAGE_RESPONSE = "messageResponse";
    public static final String PASSWORD_DEFAULT = "123456";
    public static final String CHANGE_PASSWORD_FAIL = "change_password_fail";
    public static final String BUILDING_NOT_FOUND = "BUILDING_NOT_FOUND";
}
