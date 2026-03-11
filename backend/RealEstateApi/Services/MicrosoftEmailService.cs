using Microsoft.Graph;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.Models;
using Microsoft.Identity.Client;
using System.Net.Http.Headers;
using Microsoft.Kiota.Abstractions.Authentication;
using Microsoft.Kiota.Abstractions;

namespace RealEstateApi.Services;

public class MicrosoftEmailService : IEmailService
{
    private readonly IConfiguration _config;

    public MicrosoftEmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string to, string subject, string body, string refreshToken)
    {
        var clientId = _config["Microsoft:ClientId"];
        var clientSecret = _config["Microsoft:ClientSecret"];
        var tenantId = "common";

        var app = ConfidentialClientApplicationBuilder.Create(clientId)
            .WithClientSecret(clientSecret)
            .WithAuthority(AzureCloudInstance.AzurePublic, tenantId)
            .Build();

        var result = await ((IByRefreshToken)app).AcquireTokenByRefreshToken(new[] { "https://graph.microsoft.com/.default" }, refreshToken)
            .ExecuteAsync();

        var authProvider = new TokenAuthenticationProvider(result.AccessToken);
        var graphClient = new GraphServiceClient(authProvider);

        var message = new Message
        {
            Subject = subject,
            Body = new ItemBody
            {
                ContentType = BodyType.Html,
                Content = body
            },
            ToRecipients = new List<Recipient>
            {
                new Recipient
                {
                    EmailAddress = new EmailAddress
                    {
                        Address = to
                    }
                }
            }
        };

        await graphClient.Me.SendMail.PostAsync(new Microsoft.Graph.Me.SendMail.SendMailPostRequestBody
        {
            Message = message,
            SaveToSentItems = true
        });
    }

    private class TokenAuthenticationProvider : IAuthenticationProvider
    {
        private readonly string _accessToken;
        public TokenAuthenticationProvider(string accessToken) => _accessToken = accessToken;
        public Task AuthenticateRequestAsync(RequestInformation request, Dictionary<string, object>? additionalAuthenticationContext = null, CancellationToken cancellationToken = default)
        {
            request.Headers.Add("Authorization", $"Bearer {_accessToken}");
            return Task.CompletedTask;
        }
    }
}
