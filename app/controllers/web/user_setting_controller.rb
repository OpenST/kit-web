class Web::UserSettingController < Web::BaseController

  layout "economy"

  before_action :check_if_client_is_supported
  before_action :set_page_meta_info

  before_action :redirect_to_login_if_login_cookie_not_present

  after_action :remove_browser_caching

  # Kit economy team page
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def team
    @response = CompanyApi::Request::Setting.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).get_team_details({})

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)
    @fe_no_nav = true
  end

  # Kit Company Information Page
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def company_information
    @response = CompanyApi::Request::Setting.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).company_information({})

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)
  end


end
