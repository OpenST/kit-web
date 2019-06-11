# frozen_string_literal: true
module GlobalConstant

  class RoutesMap

    class << self

      def getRoutes
        {
          token_dashboard:      "/#{GlobalConstant::Environment.url_prefix}/",
          token_setup:          "/#{GlobalConstant::Environment.url_prefix}/token/setup/",
          mainnet_token_dashboard: "/#{GlobalConstant::Environment.main_sub_env_url_prefix}/",
          sandbox_token_dashboard: "/#{GlobalConstant::Environment.sandbox_sub_url_prefix}/",
          token_deploy:         "/#{GlobalConstant::Environment.url_prefix}/token/deploy/",
          token_mint:           "/#{GlobalConstant::Environment.url_prefix}/token/mint/",
          token_mint_progress:  "/#{GlobalConstant::Environment.url_prefix}/token/mint-progress/",
          developer:            "/#{GlobalConstant::Environment.url_prefix}/developer/",
          test_economy:         "/#{GlobalConstant::Environment.url_prefix}/test-economy",
          team:                 "/settings/team/",
          company_information:  "/settings/company-information/",
          setup_mfa:            "/mfa/",
          authenticate_mfa:     "/mfa/",
          service_unavailable:  "/service-unavailable/",
          verify_email:         "/verify-email/",
          verify_device:        "/verify-device/",
          login:                "/login/",
          logout:                "/logout/"

        }
      end

      def getApis
        {
            api_token:            "/#{GlobalConstant::Environment.url_prefix}/api/token",
            api_addresses:        "/#{GlobalConstant::Environment.url_prefix}/api/token/addresses",
            api_get_balance:      "/#{GlobalConstant::Environment.url_prefix}/api/token/balance",
            api_token_setup_address_generation: "/#{GlobalConstant::Environment.url_prefix}/api/token/addresses/create-managed-address",
            api_request_whitelist:"/#{GlobalConstant::Environment.main_sub_env_url_prefix}/api/token/request-whitelist",
            api_deploy:           "/#{GlobalConstant::Environment.url_prefix}/api/token/deploy",
            api_mint:             "/#{GlobalConstant::Environment.url_prefix}/api/token/mint",
            api_workflow:         "/#{GlobalConstant::Environment.url_prefix}/api/workflow",
            api_grant:            "/#{GlobalConstant::Environment.url_prefix}/api/grant",
            api_pre_mint:         "/#{GlobalConstant::Environment.url_prefix}/api/token/pre-mint",
            get_api_keys:         "/#{GlobalConstant::Environment.url_prefix}/api/developer/api-keys",
            delete_api_key:       "/#{GlobalConstant::Environment.url_prefix}/api/developer/api-keys/delete",
            get_webhook_secrets:         "/#{GlobalConstant::Environment.url_prefix}/api/developer/webhook-secrets",
            delete_webhook_secrets:      "/#{GlobalConstant::Environment.url_prefix}/api/developer/delete-webhook-secrets",
            api_activate_test_economy: "/#{GlobalConstant::Environment.url_prefix}/api/test-economy",
            api_invite_to_test_economy: "/#{GlobalConstant::Environment.url_prefix}/api/test-economy/invite",
            api_list_admins:      "/api/setting/team/list",
            delete_admin_endpoint:"/api/setting/team/delete-admin",
            update_role_endpoint: "/api/setting/team/update-super-admin-role",
            reset_mfa_endpoint:   "/api/setting/team/reset-mfa",
            resend_admin_invite:  "/api/setting/team/resend-admin-invite",
            api_invite_admin:     "/api/setting/team/invite-admin",
            api_save_company_info:"/api/setting/company-information",
            api_sign_up:          "/api/sign-up",
            api_send_verify_email_link:"/api/verify-email/request-link",
            api_send_verify_device_link: "/api/verify-device/request-link",
            api_login:            "/api/login",
            api_mfa:              "/api/mfa",
            api_reset_password:   "/api/reset-password",
            api_send_reset_password_link:"/api/reset-password/request-link"
        }
      end

    end

  end

end

