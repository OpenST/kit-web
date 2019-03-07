module CompanyApi

  module Request

    class MintBt < CompanyApi::Request::Base

      # Initialize
      #
      # * Author: Ankit
      # * Date: 03/01/2019
      # * Reviewed By: Kedar
      #
      # @param [Klass] api_response_formatter_class (mandatory) - Api response formatter_class for api Response
      # @param [Hash] cookies (mandatory) - cookies that need to be sent to API
      # @param [Hash] headers (optional) - headers that need to be sent to API
      #
      # @return [CompanyApi::Request::MintBt] returns an object of CompanyApi::Request::MintBt class
      #
      def initialize(api_response_formatter_class, cookies, headers = {})

        super(api_response_formatter_class, cookies, true, headers)
        @service_base_route = 'token/mint/'

      end

      # Get mint details
      #
      # * Author: Puneet
      # * Date: 08/12/2018
      # * Reviewed By: Sunil
      #
      def mint
        get('', {})
      end

      # Get mint progress
      #
      # * Author: Puneet
      # * Date: 08/12/2018
      # * Reviewed By: Sunil
      #
      def mint_progress
        get('progress', {})
      end

    end

  end

end
