using System.Security.Cryptography;
using System.Text;

namespace RealEstateApi.Services;

public interface ITokenService
{
    (string rawToken, string tokenHash) GenerateToken();
    string HashToken(string rawToken);
    bool VerifyToken(string rawToken, string tokenHash);
}

public class TokenService : ITokenService
{
    public (string rawToken, string tokenHash) GenerateToken()
    {
        byte[] tokenBytes = RandomNumberGenerator.GetBytes(32);
        string rawToken = Convert.ToBase64String(tokenBytes);
        string tokenHash = HashToken(rawToken);
        return (rawToken, tokenHash);
    }

    public string HashToken(string rawToken)
    {
        using var sha256 = SHA256.Create();
        byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(rawToken));
        return Convert.ToBase64String(hashBytes);
    }

    public bool VerifyToken(string rawToken, string tokenHash)
    {
        return HashToken(rawToken) == tokenHash;
    }
}
