package org.example.advancedrealestate_be.security;
import jakarta.servlet.http.HttpServletRequest;
import org.example.advancedrealestate_be.Utils.CheckPermissionUtil;
import org.example.advancedrealestate_be.entity.User;
import org.example.advancedrealestate_be.exception.AppException;
import org.example.advancedrealestate_be.exception.ErrorCode;
import org.example.advancedrealestate_be.repository.PermissionRepository;
import org.example.advancedrealestate_be.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import java.lang.reflect.Method;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;

@Component
public class SecurityPermissionInterceptor implements HandlerInterceptor {

    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final HttpServletRequest request;


    @Autowired
    public SecurityPermissionInterceptor(PermissionRepository permissionRepository, UserRepository userRepository, HttpServletRequest request) {
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
        this.request = request;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response, Object handler) throws Exception {
        if (handler instanceof HandlerMethod handlerMethod) {
            Method method = handlerMethod.getMethod();
            if (method.isAnnotationPresent(CheckPermissionUtil.class)) {
                CheckPermissionUtil checkPermission = method.getAnnotation(CheckPermissionUtil.class);
                String requiredPermissionLink = checkPermission.value();
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
                List<String> userPermissions = permissionRepository.findPermissionsByRoleLink(user.getRole().getId());
                System.out.println(request.getMethod() + " " + request.getRequestURL().toString());

                if (!userPermissions.contains(requiredPermissionLink)) {
                    System.out.println("403 Forbidden - Access is denied!");
                    throw new AppException(ErrorCode.USER_FORBIDDEN);
                }
            }
        }
        return true;
    }
}