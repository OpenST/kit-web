# frozen_string_literal: true
module GlobalConstant

  class CompanyOtherProductUrls < GlobalConstant::Base

    class << self

      def kit_root_url
        config['kit_root_url']
      end

      def kyc_root_url
        config['kyc_root_url']
      end

      def view_root_url
        config['view_root_url']
      end

      def dev_ost_root_url
        config['dev_ost_root_url']
      end

      private

      def config
        GlobalConstant::Base.company_other_product_urls
      end

    end

  end

end
