module CompanyApi

  module Request

    class Setting < CompanyApi::Request::Base

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
      # @return [CompanyApi::Request::Setting] returns an object of CompanyApi::Request::Setting class
      #
      def initialize(api_response_formatter_class, cookies, headers = {})

        super(api_response_formatter_class, cookies, false, headers)
        @service_base_route = 'setting/'

      end

      # Get team details
      #
      # * Author: Puneet
      # * Date: 08/12/2018
      # * Reviewed By: Sunil
      #
      # @param [Hash] params
      #
      def get_team_details(params)
        get('team', params)
      end

      # Get company information
      #
      # * Author: Ankit
      # * Date: 08/04/2019
      # * Reviewed By:
      #
      def company_information(params)
        get('company-information',params)
      end

    end

  end

end
