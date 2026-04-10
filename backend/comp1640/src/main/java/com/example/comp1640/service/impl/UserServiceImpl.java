package com.example.comp1640.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.comp1640.dto.request.UserRequest;
import com.example.comp1640.dto.response.UserResponse;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.exception.UnauthorizedException;
import com.example.comp1640.entity.Department;
import com.example.comp1640.entity.Role;
import com.example.comp1640.entity.User;
import com.example.comp1640.enums.RoleName;
import com.example.comp1640.repository.DepartmentRepository;
import com.example.comp1640.repository.RoleRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.repository.NotificationLogRepository;
import com.example.comp1640.repository.VoteRepository;
import com.example.comp1640.repository.CommentRepository;
import com.example.comp1640.repository.DocumentRepository;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.repository.UserTermsAcceptanceRepository;
import com.example.comp1640.service.UserService;

@Service
// make all public methods transactional so that lazy associations can be
// accessed
// (also prevents LazyInitializationException when converting entities to DTOs)
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final DepartmentRepository deptRepo;
    private final PasswordEncoder passwordEncoder;
    private final NotificationLogRepository notifLogRepo;
    private final VoteRepository voteRepo;
    private final CommentRepository commentRepo;
    private final DocumentRepository documentRepo;
    private final IdeaRepository ideaRepo;
    private final UserTermsAcceptanceRepository userTermsRepo;

    public UserServiceImpl(
            UserRepository userRepo,
            RoleRepository roleRepo,
            DepartmentRepository deptRepo,
            PasswordEncoder passwordEncoder,
            NotificationLogRepository notifLogRepo,
            VoteRepository voteRepo,
            CommentRepository commentRepo,
            DocumentRepository documentRepo,
            IdeaRepository ideaRepo,
            UserTermsAcceptanceRepository userTermsRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.deptRepo = deptRepo;
        this.passwordEncoder = passwordEncoder;
        this.notifLogRepo = notifLogRepo;
        this.voteRepo = voteRepo;
        this.commentRepo = commentRepo;
        this.documentRepo = documentRepo;
        this.ideaRepo = ideaRepo;
        this.userTermsRepo = userTermsRepo;
    }

    @Override
    public UserResponse create(UserRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã tồn tại");
        }

        Role role = resolveRole(request);

        Department dept = deptRepo.findById(request.getDeptId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy department với id: " + request.getDeptId()));

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStaffType(request.getStaffType());
        user.setRole(role);
        user.setDepartment(dept);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return toResponse(userRepo.save(user));
    }

    @Override
    public List<UserResponse> getAll(Integer deptId) {
        List<User> users = deptId != null
                ? userRepo.findByDepartment_DeptId(deptId)
                : userRepo.findAll();
        return users.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public UserResponse getById(Integer id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với id: " + id));
        return toResponse(user);
    }

    @Override
    public UserResponse update(Integer id, UserRequest request) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với id: " + id));

        // allow changing email but check uniqueness
        if (request.getEmail() != null && !request.getEmail().isBlank()
                && !request.getEmail().equals(user.getEmail())) {
            if (userRepo.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email đã tồn tại");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }

        if (request.getStaffType() != null && !request.getStaffType().isBlank()) {
            user.setStaffType(request.getStaffType());
        }

        if (request.getRoleName() != null || request.getRoleId() != null) {
            user.setRole(resolveRole(request));
        }

        if (request.getDeptId() != null) {
            Department dept = deptRepo.findById(request.getDeptId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy department với id: " + request.getDeptId()));
            user.setDepartment(dept);
        }

        user.setUpdatedAt(LocalDateTime.now());

        return toResponse(userRepo.save(user));
    }

    @Override
    public void delete(Integer id) {
        if (!userRepo.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy user với id: " + id);
        }
        // HR_MANAGER không được xóa tài khoản ADMIN
        checkNotDemotingAdmin(id);
        // 1. Delete notification_log records (as recipient, or related to user's
        // ideas/comments)
        notifLogRepo.deleteByRecipientUserId(id);
        notifLogRepo.deleteByCommentAuthorUserId(id);
        notifLogRepo.deleteByIdeaAuthorUserId(id);
        // 2. Delete votes by this user and votes on this user's ideas
        voteRepo.deleteByUserUserId(id);
        voteRepo.deleteByIdeaAuthorUserId(id);
        // 3. Delete comments on this user's ideas and comments by this user
        commentRepo.deleteByIdeaAuthorUserId(id);
        commentRepo.deleteByUserUserId(id);
        // 4. Delete documents of this user's ideas
        documentRepo.deleteByIdeaAuthorUserId(id);
        // 5. Delete idea_category join rows and ideas
        ideaRepo.deleteIdeaCategoriesByUserUserId(id);
        ideaRepo.deleteByUserUserId(id);
        // 6. Delete user_terms_acceptance
        userTermsRepo.deleteByUserUserId(id);
        // 7. Delete the user
        userRepo.deleteById(id);
    }

    @Override
    public void toggleActive(Integer id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với id: " + id));
        // HR_MANAGER không được vô hiệu hóa tài khoản ADMIN
        checkNotDemotingAdmin(id);
        // guard against null booleans
        boolean current = Boolean.TRUE.equals(user.getIsActive());
        user.setIsActive(!current);
        user.setUpdatedAt(LocalDateTime.now());
        userRepo.save(user);
    }

    /**
     * HR_MANAGER không được xóa/vô hiệu hóa tài khoản ADMIN.
     * ADMIN có thể thực hiện bất kỳ thao tác nào.
     */
    private void checkNotDemotingAdmin(Integer targetUserId) {
        String callerRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream().findFirst().map(a -> a.getAuthority().replace("ROLE_", "")).orElse("");
        if ("HR_MANAGER".equals(callerRole)) {
            User target = userRepo.findById(targetUserId).orElse(null);
            if (target != null && target.getRole() != null
                    && RoleName.ADMIN.equals(target.getRole().getRoleName())) {
                throw new UnauthorizedException("HR Manager không được phép xóa hoặc vô hiệu hóa tài khoản Admin");
            }
        }
    }

    // Helper: resolve role by name (preferred) or by ID fallback
    private Role resolveRole(UserRequest request) {
        if (request.getRoleName() != null && !request.getRoleName().isBlank()) {
            try {
                RoleName rn = RoleName.valueOf(request.getRoleName().trim().toUpperCase());
                return roleRepo.findByRoleName(rn)
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy role: " + request.getRoleName()));
            } catch (IllegalArgumentException e) {
                throw new ResourceNotFoundException("Role không hợp lệ: " + request.getRoleName());
            }
        }
        if (request.getRoleId() != null) {
            return roleRepo.findById(request.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy role với id: " + request.getRoleId()));
        }
        throw new ResourceNotFoundException("Phải cung cấp roleName hoặc roleId");
    }

    // Helper: convert entity -> response
    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getStaffType(),
                user.getIsActive(),
                // roleName is an enum, convert to String (use name())
                user.getRole() != null ? user.getRole().getRoleName().name() : null,
                user.getDepartment() != null ? user.getDepartment().getDeptId() : null,
                user.getDepartment() != null ? user.getDepartment().getDeptName() : null,
                user.getCreatedAt());
    }
}