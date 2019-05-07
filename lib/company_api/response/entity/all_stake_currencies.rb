module CompanyApi

  module Response

    module Entity

      class AllStakeCurrencies

        # Initialize
        #
        # * Author: Puneet
        # * Date: 30/04/2019
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::AllStakeCurrencies] returns an object of CompanyApi::Response::Entity::AllStakeCurrencies class
        #
        def initialize(data)
          @data = data
        end

        def formatted_data
          @fd ||= begin
            buffer = []
            data.each do |d|
              buffer.push(CompanyApi::Response::Entity::StakeCurrency.new(d))
            end
            buffer
          end
        end

        private

        def data
          @data
        end

      end

    end

  end

end
