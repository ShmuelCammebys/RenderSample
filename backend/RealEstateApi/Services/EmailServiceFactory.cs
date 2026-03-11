using Microsoft.Extensions.DependencyInjection;

namespace RealEstateApi.Services;

public class EmailServiceFactory
{
    private readonly IServiceProvider _serviceProvider;

    public EmailServiceFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IEmailService GetEmailService(string provider)
    {
        return provider.ToLower() switch
        {
            "google" => _serviceProvider.GetRequiredService<GoogleEmailService>(),
            "microsoft" => _serviceProvider.GetRequiredService<MicrosoftEmailService>(),
            _ => throw new NotSupportedException($"Email provider {provider} is not supported.")
        };
    }
}
