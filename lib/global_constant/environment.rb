module GlobalConstant

  class Environment

    class << self

      def main_sub_env_name
        'main'
      end

      def sandbox_sub_env_name
        'sandbox'
      end

      def main_sub_env_url_prefix
        'mainnet'
      end

      def sandbox_sub_url_prefix
        'testnet'
      end

      def url_prefix
        if GlobalConstant::Base.main_sub_environment?
          main_sub_env_url_prefix
        else
          sandbox_sub_url_prefix
        end
      end

      def production_environment
        'production'
      end

      def is_main_production?
        GlobalConstant::Base.main_sub_environment? && is_production?
      end

      def is_production?
        GlobalConstant::Base.environment_name == GlobalConstant::Environment.production_environment
      end

      # Get go back env url prefix remember page
      #
      def go_back_env_url_prefix_param
        return 'gbeup'
      end

    end

  end

end