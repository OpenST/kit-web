module CompanyApi

  module Response

    module Entity

      class ApiKeys

        # Initialize
        #
        # * Author: Dhananjay
        # * Date: 31/05/2019
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::ApiKeys]
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def api_keys
          data['api_keys']
        end

      end

    end

  end

end
