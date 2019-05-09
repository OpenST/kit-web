module CompanyApi

  module Response

    module Entity

      class PricePoints

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        # @param [CompanyApi::Response::Entity::Token] token (mandatory) - token entity data
        #
        # @return [CompanyApi::Response::Entity::PricePoints] returns an object of CompanyApi::Response::Entity::OraclePricePoints class
        #
        def initialize(data, token)
          @data = data
          @client_token = token
        end

        def data
          @data
        end

        # Stake currency to fiat conversion factor value.
        #
        # * Author: Anagha
        # * Date: 09/05/2018
        # * Reviewed By:
        #
        # @param [String] stake_currency (mandatory)
        # @param [String] fiat (mandatory)
        #
        # @return
        #
        def stake_currency_to_fiat_conversion_factor(stake_currency, fiat)
            conversion_factors[stake_currency][fiat]
        end

        private


        def conversion_factors
          @c_r ||= begin
            @data
          end

        end

      end

    end

  end

end
