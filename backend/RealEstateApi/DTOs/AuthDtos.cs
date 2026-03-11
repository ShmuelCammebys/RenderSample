namespace RealEstateApi.DTOs;

public record LoginRequest(string Username, string Password);
public record RegisterRequest(string Username, string Password, string Email, string FullName);
public record AuthResponse(string Token, string Username);
