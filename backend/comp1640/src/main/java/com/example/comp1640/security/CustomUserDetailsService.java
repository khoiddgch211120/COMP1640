// package com.example.comp1640.security;

// import com.example.comp1640.model.User;
// import com.example.comp1640.repository.UserRepository;
// import org.springframework.security.core.userdetails.*;
// import org.springframework.stereotype.Service;

// @Service
// public class CustomUserDetailsService implements UserDetailsService {

//     private final UserRepository userRepo;

//     // Constructor tường minh (KHÔNG Lombok)
//     public CustomUserDetailsService(UserRepository userRepo) {
//         this.userRepo = userRepo;
//     }

//     @Override
//     public UserDetails loadUserByUsername(String email)
//             throws UsernameNotFoundException {

//         User user = userRepo.findByEmail(email)
//                 .orElseThrow(() ->
//                         new UsernameNotFoundException("User not found"));

//         return org.springframework.security.core.userdetails.User
//                 .withUsername(user.getEmail())
//                 .password(user.getPasswordHash())
//                 .roles(user.getRole().getRoleName())
//                 .build();
//     }
// }