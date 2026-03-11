namespace RealEstateApi.DTOs;

public record CreateShowingRequest(int UnitId, string ProspectEmail);
public record UnitDto(int Id, string BuildingName, string UnitNumber, bool IsEligible);
public record ShowingDto(Guid Id, int UnitId, string ProspectEmail, string Status, DateTime CreatedAtUtc);
