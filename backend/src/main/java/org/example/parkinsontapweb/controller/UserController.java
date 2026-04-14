package org.example.parkinsontapweb.controller;

import org.example.parkinsontapweb.dto.DtoAuthResponse;
import org.example.parkinsontapweb.dto.LoginDTO;
import org.example.parkinsontapweb.security.JwtProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin("*")
public class UserController {
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public UserController(
            AuthenticationManager authenticationManager,
            JwtProvider jwtProvider
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<DtoAuthResponse> login (@RequestBody LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDTO.getEmail(), loginDTO.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.generateToken(authentication);
        return new ResponseEntity<>(new DtoAuthResponse(token), HttpStatus.OK);
    }


}
