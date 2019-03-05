module ApplicationHelper

  # does action require a specific css manifest file
  #
  def has_specific_css_manifest_file?
    @page_assets_data.present? ? !(@page_assets_data[:specific_css_required] == 0) : true
  end

  # does action require a specific js manifest file
  #
  def has_specific_js_manifest_file?
    @page_assets_data.present? ? !(@page_assets_data[:specific_js_required] == 0) : true
  end

  # get specific manifest path for css and js
  #
  def specific_manifest_file_path
    "#{get_formatted_controller_name}-#{get_formatted_action_name}"
  end

  # format controller name for specific manifest file path
  #
  def get_formatted_controller_name
    params[:controller]
  end

  # format action name for specific manifest file path
  #
  def get_formatted_action_name
    params[:action].gsub('_','-')
  end

  # Get OST currency symbol based on SUB ENV
  #
  def ost_currency_symbol
    if(GlobalConstant::Base.main_sub_environment?)
      "OST"
    else
      "OST⍺"
    end
  end

  # Get value chain text based on SUB ENV
  #
  def ost_valuechain_text
    if(Rails.env.production? && GlobalConstant::Base.main_sub_environment?)
      'Main Ethereum Network'
    else
      'Ropsten Test Network'
    end
  end

  # Get go back env url prefix for pages shared across sub envs
  #
  def go_back_env_url_prefix
    params[GlobalConstant::Environment.go_back_env_url_prefix_param] == GlobalConstant::Environment.main_sub_env_url_prefix ?
      GlobalConstant::Environment.main_sub_env_url_prefix : GlobalConstant::Environment.sandbox_sub_url_prefix
  end

  # Get go back to url query param
  #
  def get_go_back_url_query_param
    go_back_value = (params[GlobalConstant::Environment.go_back_env_url_prefix_param].present? ?
                       params[GlobalConstant::Environment.go_back_env_url_prefix_param] :
                       GlobalConstant::Environment.url_prefix)
    return GlobalConstant::Environment.go_back_env_url_prefix_param + "=" + go_back_value
  end

end