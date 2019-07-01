module CompanyApi

  module Response

    module Entity

      class WebhookSecrets

        # Initialize
        #
        # * Author: Dhananjay
        # * Date: 31/05/2019
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::WebhookSecrets]
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def webhook_secrets
          @data["webhook_secrets"]
        end

      end

    end

  end

end
