module CompanyApi

  module Response

    module Formatter

      class Token < CompanyApi::Response::Formatter::Base

        attr_reader :workflow_payload, :developer_page_addresses,
                    :dashboard_details, :graph_urls, :test_economy_details, :all_stake_currencies

        # Initialize
        #
        # * Author: Ankit
        # * Date: 03/01/2019
        # * Reviewed By: Kedar
        #
        # @param [Hash] data (mandatory) - company api response data
        #
        # @return [CompanyApi::Response::Formatter::Token] returns an object of CompanyApi::Response::Formatter::Token class
        #
        def initialize(data)
          super
        end

        # Perform
        #
        # * Author: Ankit
        # * Date: 03/01/2019
        # * Reviewed By: Kedar
        #
        def perform
          set_token(@data['token'])
          set_stake_currencies(@data['stake_currencies'])
          set_all_stake_currencies(@data['all_stake_currencies']) if @data['all_stake_currencies'].present?
          set_price_points(@data['price_points'])
          set_manager(@data['manager']) if @data['manager'].present?
          set_client(@data['client']) if @data['client'].present?
          set_client_manager(@data['client_manager'])
          set_contract_details(@data['contract_details'])
          set_gas_price(@data['gas_price'])
          set_auxiliary_addresses(@data['auxiliary_addresses'])
          set_origin_addresses(@data['origin_addresses'])
          set_workflow(@data['workflow'])
          set_workflow_current_step(@data['workflow_current_step'])
          set_sign_messages(@data['sign_messages'])
          set_workflow_payload(@data['workflow_payload'])
          set_sub_env_payload(@data['sub_env_payloads']) if @data['sub_env_payloads'].present?
          set_developer_page_addresses(@data['developer_page_addresses']) if @data['developer_page_addresses'].present?
          set_dashboard_details(@data['dashboard_details']) if @data['dashboard_details'].present?
          set_graph_urls(@data['graph_urls']) if @data['graph_urls'].present?
          set_test_economy_details(@data['test_economy_details']) if @data['test_economy_details'].present?
          set_min_balances(@data['min_balances']) if @data['min_balances'].present?
        end

        private

        # Set stake currencies
        #
        # * Author: Puneet
        # * Date: 30/04/2019
        # * Reviewed By:
        #
        # @param [Array] all_stake_currencies_data (mandatory) - all stake currencies array
        #
        # Sets @all_stake_currencies
        #
        def set_all_stake_currencies(all_stake_currencies_data)
          @all_stake_currencies = CompanyApi::Response::Entity::AllStakeCurrencies.new(all_stake_currencies_data)
        end

        def set_workflow_payload(data)
          @workflow_payload = CompanyApi::Response::Entity::WorkflowPayload.new(data)
        end

        def set_developer_page_addresses(data)
          @developer_page_addresses = CompanyApi::Response::Entity::DeveloperPageAddresses.new(data)
        end

        def set_dashboard_details(data)
          @dashboard_details = CompanyApi::Response::Entity::DashboardDetails.new(data)
        end

        def set_graph_urls(data)
          @graph_urls = CompanyApi::Response::Entity::GraphUrls.new(data)
        end

        def set_test_economy_details(data)
          @test_economy_details = CompanyApi::Response::Entity::TestEconomyDetails.new(data)
        end

      end

    end

  end

end
