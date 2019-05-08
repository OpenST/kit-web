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

        def to_fiat_conversion_factor(currency_pref)
          conversion_factors(currency_pref)
        end

        private

        def conversion_factors(currency_pref)
          @c_r ||= begin
            @data[@client_token.stake_currency_symbol] = BigDecimal.new(@data[@client_token.stake_currency_symbol][currency_pref])
          end

        end

      end

    end

  end

end
