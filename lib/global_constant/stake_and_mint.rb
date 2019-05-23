# frozen_string_literal: true
module GlobalConstant

  class StakeAndMint

    class << self

      def initial_ost_funding
        '10000'  # Keep this in sync with SAAS and KIT_API
      end

      def initial_usdc_funding
        '10000'  # Keep this in sync with SAAS and KIT_API
      end

      def min_bt_to_mint
        '1'
      end

      def step_bt_to_mint
        '0.00001'
      end
    end

  end

end

