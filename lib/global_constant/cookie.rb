# frozen_string_literal: true
module GlobalConstant

  class Cookie

    class << self

      def user_cookie_name
        'ost_platform_ca'
      end

      def last_used_env_cookie_name
        'ost_platform_luse'
      end

      # Not a actual cookie. but key is used internally to manage cookies instructed by company API
      def new_api_cookie_key
        'ost_platform_new_api_cookies'
      end

      def utm_params_cookie_name
        'ost_up'
      end

      def device_verification_toast_cookie_name
        'ost_platform_dvt'
      end

      def secure_data_access_cookie_name
        'ost_platform_sda'
      end

    end

  end

end
