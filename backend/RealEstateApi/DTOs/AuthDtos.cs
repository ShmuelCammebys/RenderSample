namespace RealEstateApi.DTOs;

public record LoginRequest(string Username, string Password);
public record AuthResponse(string Token, string Username);
