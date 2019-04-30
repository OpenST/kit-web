module WebPresenter

  class TokenPresenter < ::WebPresenter::BasePresenter

    # Init
    #
    # @param [Result::Base] data_obj (mandatory) - Page data
    # @param [Hash] params (optional) - Page params
    #
    # @return [Web::Economy::Token] returns an object of Web::Economy::Token class
    #
    def initialize(data_obj, params = {})
      super
    end

    # Client manager details in presenter object
    #
    # * Author: Santhosh
    # * Date: 03/01/2019
    # * Reviewed By: Kedar
    #
    def client_manager
      @t_client_manager ||= begin
        formatter_obj.present? ? formatter_obj.client_manager : nil
      end
    end

    # contract details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def contract_details
      @t_contract_details ||= begin
        formatter_obj.present? ? formatter_obj.contract_details : nil
      end
    end

    # gas_price details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def gas_price
      @t_gas_price ||= begin
        formatter_obj.present? ? formatter_obj.gas_price : nil
      end
    end

    # auxiliary_addresses details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def auxiliary_addresses
      @t_auxiliary_addresses ||= begin
        formatter_obj.present? ? formatter_obj.auxiliary_addresses : nil
      end
    end

    # origin_addresses details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def origin_addresses
      @t_origin_addresses ||= begin
        formatter_obj.present? ? formatter_obj.origin_addresses : nil
      end
    end

    # origin_addresses details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def workflow
      @t_workflow ||= begin
        formatter_obj.present? ? formatter_obj.workflow : nil
      end
    end

    # origin_addresses details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def workflow_payload
      @t_workflow_p ||= begin
        formatter_obj.present? ? formatter_obj.workflow_payload : nil
      end
    end

    # origin_addresses details in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def workflow_current_step
      @t_workflow_csp ||= begin
        formatter_obj.present? ? formatter_obj.workflow_current_step : nil
      end
    end

    # minimum ost in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def min_ost_in_wei
      @t_min_ost ||= begin
        formatter_obj.present? ? formatter_obj.min_ost_in_wei : nil
      end
    end

    # minimum eth in presenter object
    #
    # * Author: Alpesh
    # * Date: 18/01/2019
    # * Reviewed By:
    #
    def min_eth_in_wei
      @t_min_eth ||= begin
        formatter_obj.present? ? formatter_obj.min_eth_in_wei : nil
      end
    end

    # Developer page addresses in presenter object
    #
    # * Author: Shlok
    # * Date: 04/03/2019
    # * Reviewed By:
    #
    def developer_page_addresses
      @developer_page_addresses ||= begin
        formatter_obj.present? ? formatter_obj.developer_page_addresses : nil
      end
    end

    # Developer page addresses in presenter object
    #
    # * Author: Shlok
    # * Date: 04/03/2019
    # * Reviewed By:
    #
    def dashboard_details
      @dashboard_details ||= begin
        formatter_obj.present? ? formatter_obj.dashboard_details : nil
      end
    end

    # Token Dashboard Graph URLs in presenter object
    #
    # * Author: Dhananjay
    # * Date: 02/04/2019
    # * Reviewed By: Sunil
    #
    def graph_urls
      @graph_urls ||= begin
        formatter_obj.present? ? formatter_obj.graph_urls : nil
      end
    end

    # Test economy details in presenter object
    #
    # * Author: Puneet
    # * Date: 15/04/2019
    # * Reviewed By:
    #
    def test_economy_details
      @test_economy_details ||= begin
        formatter_obj.present? ? formatter_obj.test_economy_details : nil
      end
    end

    def key_provider
      @k_p ||= begin
        if formatter_obj.present?
          formatter_obj.client_token.has_ost_managed_owner? ? 'ost' : 'metamask'
        else
          nil
        end
      end
    end

    def fetch_balance_for_currencies
      @f_b_c ||= begin
        currencies = ['ETH']
        currencies.push(stake_currencies.id_obj_map[client_token.stake_currency_id].symbol)
      end
    end

  end

end