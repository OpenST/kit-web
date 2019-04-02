module CompanyApi

  module Response

    module Entity

      class GraphUrls

        # Initialize
        #
        # * Author: Dhananjay
        # * Date: 02/04/2019
        # * Reviewed By: Sunil
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::GraphUrls] returns an object of CompanyApi::Response::Entity::GraphUrls class
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

      end

    end

  end

end
