module CompanyApi

  module Response

    module Entity

      class Client

        # Initialize
        #
        # * Author: Puneet
        # * Date: 02/02/2018
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::Client] returns an object of CompanyApi::Response::Entity::Client class
        #
        def initialize(data)
          @data = data
        end

        def data
          @data
        end

        def id
          @data['id']
        end

        def has_setup_test_economy?
          GlobalConstant::Base.main_sub_environment? ? has_setup_mainnet_test_economy? : has_setup_testnet_test_economy?
        end

        private

        def has_setup_testnet_test_economy?
          sandbox_statuses.include?(sandbox_test_economy_qr_code_uploaded_status) &&
              sandbox_statuses.include?(sandbox_registered_in_mappy_server_status)
        end

        def has_setup_mainnet_test_economy?
          mainnet_statuses.include?(mainnet_test_economy_qr_code_uploaded_status) &&
              mainnet_statuses.include?(mainnet_registered_in_mappy_server_status)
        end

        def mainnet_statuses
          @data['mainnet_statuses']
        end

        def sandbox_statuses
          @data['sandbox_statuses']
        end

        def sandbox_test_economy_qr_code_uploaded_status
          'sandbox_test_economy_qr_code_uploaded_status'
        end

        def sandbox_registered_in_mappy_server_status
          'sandbox_registered_in_mappy_server_status'
        end

        def mainnet_test_economy_qr_code_uploaded_status
          'mainnet_test_economy_qr_code_uploaded_status'
        end

        def mainnet_registered_in_mappy_server_status
          'mainnet_registered_in_mappy_server_status'
        end

      end

    end

  end

end
