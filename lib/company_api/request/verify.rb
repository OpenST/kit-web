module CompanyApi

  module Request

    class Verify < CompanyApi::Request::Base

      # Initialize
      #
      # * Author: Dhananjay
      # * Date: 12/06/2019
      # * Reviewed By:
      #
      # @param [Klass] api_response_formatter_class (mandatory) - Api response formatter_class for api Response
      # @param [Hash] cookies (mandatory) - cookies that need to be sent to API
      # @param [Hash] headers (optional) - headers that need to be sent to API
      #
      # @return [CompanyApi::Request::Verify] returns an object of CompanyApi::Request::Access class
      #
      def initialize(api_response_formatter_class, cookies, headers = {})

        super(api_response_formatter_class, cookies, true, headers)
        @service_base_route = '/'

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
        Rails.logger.info("\n\n\n\n=======HERE===========\n\n\n\n")
        get('verify-sda', params)
      end

    end

  end

end
