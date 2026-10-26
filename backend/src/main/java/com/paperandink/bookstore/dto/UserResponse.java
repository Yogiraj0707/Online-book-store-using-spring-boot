package com.paperandink.bookstore.dto;

import com.paperandink.bookstore.model.StoreUser;

public record UserResponse(Long id, String firstName, String lastName, String email) {
    public static UserResponse from(StoreUser user) {
        return new UserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());
    }
}
