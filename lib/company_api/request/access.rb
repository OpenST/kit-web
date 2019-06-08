module CompanyApi

  module Request

    class Access < CompanyApi::Request::Base

      # Initialize
      #
      # * Author: Puneet
      # * Date: 02/02/2018
      # * Reviewed By: Sunil
      #
      # @param [Klass] api_response_formatter_class (mandatory) - Api response formatter_class for api Response
      # @param [Hash] cookies (mandatory) - cookies that need to be sent to API
      # @param [Hash] headers (optional) - headers that need to be sent to API
      #
      # @return [CompanyApi::Request::Access] returns an object of CompanyApi::Request::Access class
      #
      def initialize(api_response_formatter_class, cookies, headers = {})

        super(api_response_formatter_class, cookies, false, headers)
        @service_base_route = '/'

      end

      # Get details to load data on signup page
      #
      # * Author: Puneet
      # * Date: 08/12/2018
      # * Reviewed By: Sunil
      #
      # @param [Hash] params
      #
      def get_sign_up_page_details(params)
        get('sign-up', params)
      end

      # Verify Email
      #
      # * Author: Puneet
      # * Date: 14/02/2018
      # * Reviewed By: Sunil
      #
      # @param [Hash] params - contains token (r_t)
      #
      def verify_email(params)
        get('verify-email', params)
      end

      # Verify Device
      #
      # * Author: Ankit
      # * Date: 23/05/2019
      # * Reviewed By:
      #
      # @param [Hash] params - contains token (d_t)
      #
      def verify_device(params)
        get('verify-device', params)
      end

      # Verify secure data access
      #
      # * Author: Ankit
      # * Date: 23/05/2019
      # * Reviewed By:
      #
      # @param [Hash] params - contains token (d_t)
      #
      def verify_secure_data_access(params)
        get("#{GlobalConstant::Environment.url_prefix}/verify-sda", params)
      end

      # Get details to load QR code for setting up MFA
      #
      # * Author: Puneet
      # * Date: 08/12/2018
      # * Reviewed By: Sunil
      #
      # @param [Hash] params
      #
      def get_setup_mfa_details(params)
        get('mfa', params)
      end

      # Fire Logout request to API
      #
      # * Author: Puneet
      # * Date: 14/02/2018
      # * Reviewed By: Sunil
      #
      # @param [Hash] params - contains authenticity_token (authenticity_token)
      #
      def logout(params)
        get('logout', params)
      end

    end

  end

end
