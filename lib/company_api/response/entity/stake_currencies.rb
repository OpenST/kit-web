module CompanyApi

  module Response

    module Entity

      class StakeCurrencies

        # Initialize
        #
        # * Author: Puneet
        # * Date: 30/04/2019
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::StakeCurrencies] returns an object of CompanyApi::Response::Entity::StakeCurrencies class
        #
        def initialize(data)
          @data = data
        end

        def symbol_obj_map
          @iom ||= begin
            buffer = {}
            id_data_map.each do |id, data|
              buffer[id] = CompanyApi::Response::Entity::StakeCurrency.new(data)
            end
            buffer
          end
        end

        private

        def id_data_map
          @data
        end

      end

    end

  end

end
