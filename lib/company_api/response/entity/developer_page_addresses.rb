module CompanyApi

  module Response

    module Entity

      class DeveloperPageAddresses

        # Initialize
        #
        # * Author: Shlok
        # * Date: 04/03/2019
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::DeveloperPageAddresses]
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def developer_page_addresses
          data["developer_page_addresses"]
        end

      end

    end

  end

end
