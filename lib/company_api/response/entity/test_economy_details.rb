module CompanyApi

  module Response

    module Entity

      class TestEconomyDetails

        # Initialize
        #
        # * Author: Puneet
        # * Date: 15/04/2019
        # * Reviewed By:
        #
        # @param [Hash] data (mandatory) - entity data
        #
        # @return [CompanyApi::Response::Entity::TestEconomyDetails] returns an object of CompanyApi::Response::Entity::TestEconomyDetails class
        #
        def initialize(data)
          @data = data
        end

        def mappy_api_endpoint
          @data['mappy_api_endpoint']
        end

        def qr_code_url
          @data['qr_code_url']
        end

        def ios_app_download_link
          @data['ios_app_download_link']
        end

        def android_app_download_link
          @data['android_app_download_link']
        end

        private

        def data
          @data
        end

      end

    end

  end

end
