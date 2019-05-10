module CompanyApi

  module Response

    module Entity

      class StakeCurrency

        # Initialize
        #
        # * Author: Puneet
        # * Date: 30/04/2019
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::StakeCurrency] returns an object of CompanyApi::Response::Entity::StakeCurrency class
        #
        def initialize(data)
          @data = data
        end

        def name
          @data['name']
        end

        def symbol
          @data['symbol']
        end

        def decimal
          @data['decimal']
        end

        def contract_address
          @data['contract_address']
        end

        private

        def data
          @data
        end

      end

    end

  end

end
