package org.example.parkinsontapweb.config;

import lombok.RequiredArgsConstructor;

import org.example.parkinsontapweb.entity.User;
import org.example.parkinsontapweb.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service()
@RequiredArgsConstructor
public class UserDetailsConf implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                // Un usuario solo puede tener un role
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getRoleName()))
        );
    }
}
