module CompanyApi

  module Response

    module Entity

      class WebhookEnabledFlag

        # Initialize
        #
        # * Author: Dhananjay
        # * Date: 31/05/2019
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::EmailAlreadySentFlag]
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def webhook_enabled_flag
          @data["webhook_enabled_flag"]
        end

      end

    end

  end

end
