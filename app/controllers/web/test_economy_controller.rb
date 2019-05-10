class Web::TestEconomyController < Web::BaseController

  layout "economy"

  before_action :check_if_device_is_supported
  before_action :set_page_meta_info
  before_action :redirect_to_login_if_login_cookie_not_present

  after_action :remove_browser_caching

  def test_economy

    @response = CompanyApi::Request::TestEconomy.new(
        CompanyApi::Response::Formatter::Token,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).fetch_test_economy_details

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::TokenPresenter.new(@response, params)

  end

end
