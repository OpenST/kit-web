module CompanyApi

  module Response

    module Entity

      class MinBalances

        # Initialize
        #
        # * Author: Anagha
        # * Date: 08/05/2019
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::ClientBalances] returns an object of CompanyApi::Response::Entity::ClientBalances class
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def min_balances
          @data.present? ? @data['min_balances'] : {}
        end

      end

    end

  end

end
