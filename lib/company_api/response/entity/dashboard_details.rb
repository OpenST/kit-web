module CompanyApi

  module Response

    module Entity

      class DashboardDetails

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

        def total_supply
          data["total_supply"]
        end

        def total_supply_dollar
          data["total_supply_dollar"]
        end

        def circulating_supply
          data["circulating_supply"]
        end

        def circulating_supply_dollar
          data["circulating_supply_dollar"]
        end

        def total_volume
          data["total_volume"]
        end

        def total_volume_dollar
          data["total_volume_dollar"]
        end

        def economy_users
          data["economy_users"]
        end
        
      end

    end

  end

end
