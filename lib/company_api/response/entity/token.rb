module CompanyApi

  module Response

    module Entity

      class Token

        # Initialize
        #
        # * Author: Ankit
        # * Date: 03/01/2019
        # * Reviewed By: Kedar
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::Token] returns an object of CompanyApi::Response::Entity::Token class
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def name
          @data['name']
        end

        def symbol
          @data['symbol']
        end

        def stake_currency_id
          @data['stake_currency_id'] ||= '' # stake currency id may not be present
        end

        def ubt_address
          @data['ubt_address'] ||= '' #ubt address may not be present
        end

        def aux_chain_id
          @data['aux_chain_id'] ||= '' #aux chain id may not be present
        end

        def conversion_factor
          @data['conversion_factor']
        end

        def is_ost_based_token?
          true
        end

        def status
          @data['status']
        end

        def properties
          @data['properties']
        end

        def has_ost_managed_owner?
          properties.include?('hasOstManagedOwner')
        end

      end

    end

  end

end
